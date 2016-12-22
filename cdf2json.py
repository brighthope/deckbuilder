#  -*- coding: utf-8 -*-
# This file is part of cdf2json.

import argparse
import shlex
import re
import json
import codecs
import os
import operator
import string
import sys
import chardet
import unicodedata

__doc = '''
This is a program to convert holotable cdf files into a json file format.
'''
__author__ = 'Cedrik Vanderhaegen <cedrik.vanderhaegen@gmail.com>'


def init_parser():
    cmd_parser = argparse.ArgumentParser(description='A program to convert cdf to json files')

    # positional argument
    cmd_parser.add_argument('dir_name', action='store', help='directory containing .cdf files (files must be encoded '
                                                             'in utf-8)')
    # options
    cmd_parser.add_argument('-o', '--output', action='store', dest='out_dir', help='directory to store the resulting '
                                                                                   'files')
    return cmd_parser.parse_args()


def get_file_names(directory):
    all_file_names = []
    for dirpath, dirnames, filenames in os.walk(directory):
        all_file_names += [os.path.join(dirpath, f) for f in filenames if f.endswith('.cdf')]
    return all_file_names


def parse_cdf_files(cdf_files):
    cards = []
    for cdf in cdf_files:
        # with open(cdf, 'r', encoding='utf-8') as f:
        with codecs.open(cdf, 'r', encoding='utf-8') as f:
            print('-parsing: ', f.name)
            side = os.path.splitext(os.path.basename(f.name))[0]
            side_short = side.replace('side', '')
            try:
                cards.extend(parse_cdf_file(f, side_short))
            except Exception as e:
                print('-cdf file parse failed: ')
                print(e)
    return cards


def parse_cdf_file(cdf_data, side):
    cards = []
    line_list = cdf_data.readlines()
    card_type = ''
    for line in line_list:
        # print(line)
        stripped_line = line.strip()
        if stripped_line:
            if stripped_line.startswith("["):
                for ch in ['[', ']']:
                    if ch in stripped_line:
                        stripped_line = stripped_line.replace(ch, "")
                card_type = stripped_line
                # print('CARD TYPE: ' + card_type)

            elif stripped_line.startswith("card"):
                # card_line = stripped_line.split(' ')
                try:
                    card_line = shlex.split(stripped_line)
                    card = parse_cdf_card(card_line, card_type, side)
                    if not card.get('legacy'):
                        cards.append(card)
                except Exception as e:
                    print('ERROR - Cdf file parse failed for line: ')
                    print('\t ' + stripped_line)
                    print(e)
    return cards


def parse_cdf_card(line, card_type, side):
    card_set = ''
    card_gametext = ''
    card_lore = ''
    card_text = line[2].split('\\n')
    card_name = clean_card_name(card_text[0])
    # card_destiny = re.search(r"\(([A-Za-z0-9_]+)\)", card_text[0])
    for card_text_part in card_text:
        # print('looping card_text_part', card_text_part)
        if card_text_part.startswith("Set:"):
            card_set = card_text_part.replace("Set:", "").strip()
        if card_text_part.startswith("Text:"):
            card_gametext = card_text_part.replace("Text:", "").strip()
        if card_text_part.startswith("Lore:"):
            card_lore = card_text_part.replace("Lore:", "").strip()

    image_info = parse_image_path(line[1])

    card_data = {
        'side': side,
        'type': card_type,
        'image_path': image_info['path'],
        'image': image_info['image'],
        'image_back': image_info['image_back'],
        'two_sided': image_info['two_sided'],
        'legacy': 'legacy' in line[1],
        'name': card_name,
        'expansion': card_set,
        'text': card_gametext,
        'lore': card_lore
        # 'destiny': card_destiny.group(1) if card_destiny else '0/7'
    }

    # if card_type == 'Admiral\'s Order':
    #     print('\t -', card)
    #     print('\t -', card_text)
    #
    if card_type.startswith('Location'):
        card_text_dark = ''
        card_text_light = ''
        for card_text_part in card_text:
            if card_text_part.startswith("DARK "):
                card_text_dark = card_text_part.split(':', 1)[1].strip()
            if card_text_part.startswith("LIGHT "):
                card_text_light = card_text_part.split(':', 1)[1].strip()
        # print('\t -', card)
        # print('\t -', card_text)
        card_data.update({
            'text_dark': card_text_dark,
            'text_light': card_text_light,
            'text': 'DARK: ' + card_text_dark + " | LIGHT: " + card_text_light
        })

    # if card_type == 'Objective':
        # print('\t -', card_text)
        # print('\t -', card_name)
        # full_path = card_data['image_path'].replace('/TWOSIDED', '')
        # card_data['image_path'] = full_path[:full_path.rfind("/")]
        # set_path = card_data['image_path'][:card_data['image_path'].rfind("/")]
        # card_data['image_path_back'] = set_path + full_path[full_path.rfind("/"):].replace('/', '/t_')
        # print('\t -', card_data['image_path'])
        # print('\t -', card_data['image_path_back'])

    return card_data


def clean_card_name(card_name):
    card_name = card_name.replace('•', '').replace('<>', '')  # remove uniqueness stuff
    k = card_name.rfind("(")  # remove destiny nr
    return card_name[:k].strip()


def parse_image_path(full_path):
    two_sided = False
    if 'TWOSIDED' in full_path:
        two_sided = True
        full_path = full_path.replace('/TWOSIDED', '')
        image_back = full_path[full_path.rfind("/"):].replace('/', '') + '.gif'
        full_path = full_path[:full_path.rfind("/")]
        image = full_path[full_path.rfind("/"):].replace('/t_', '') + '.gif'
        image_path = full_path[:full_path.rfind("/")] + '/large/'
    else:
        image_path = full_path[:full_path.rfind("/")] + '/large/'
        image = full_path[full_path.rfind("/"):].replace('/t_', '') + '.gif'
        image_back = ''

    return {
        'two_sided': two_sided,
        'path': image_path,
        'image': image,
        'image_back': image_back
    }


if __name__ == '__main__':

    parser = init_parser()

    # directory with document files
    dir_name = parser.dir_name
    dir_name = dir_name + os.sep if not dir_name.endswith(os.sep) else dir_name

    # directory for results
    out_dir_name = parser.outdir if parser.out_dir else dir_name
    out_dir_name = out_dir_name + os.sep if not out_dir_name.endswith(os.sep) else out_dir_name
    out_file = out_dir_name + 'cdf.json'
    if not os.path.exists(out_dir_name):
        os.mkdir(out_dir_name)

    file_names = get_file_names(dir_name)
    print('-Found cdf files: ', file_names)

    try:
        cards = parse_cdf_files(file_names)

        card_id = 0
        for card in cards:
            card['id'] = card_id
            card_id += 1

        # print('CARDS:\n', cards)
        print('-creating JSON file..')
        with open(out_file, mode='w', encoding='utf-8') as f:
            json.dump(cards, f, sort_keys=True, indent=2)
            print('-JSON file complete, output written to: ', out_file)
    except IOError as ioe:
        print(ioe)
        sys.exit(1)
