#!/usr/bin/env python3

from os import walk,path,makedirs
from argparse import ArgumentParser

SUFFIX = ".md"
OUTPUT_FOLDER = "src/sheets/"

parser = ArgumentParser()
parser.add_argument('-f', '--folder', type=str, default='.')
args = parser.parse_args()

# crawl over /lyr-sheets

for root, dirs, files in walk(args.folder):
    files.sort()
    for file in files:
        filepath = path.join(root, file)
        print(filepath)
        if not filepath.endswith(SUFFIX) or filepath.endswith("README.md"):
            continue
        title, band, key, tags = ['', '', '', '']
        with open(filepath, 'r') as f:
            while f.readable():
                line = f.readline().replace('\n', '')
                if line.startswith('#!'):
                    # ignore shebang
                    continue
                if line.startswith('---'):
                    # header end
                    break
                spl = line.split(' ', 1)
                if spl[0] == '#':
                    title = spl[1]
                elif spl[0] == '##':
                    band = spl[1]
                elif spl[0] == '###':
                    key = spl[1]
                elif line.startswith('*'):
                    tags = line.split('*')[1]
            body = f.read()

            # reformat header
            slug = path.join(root.replace(args.folder, ''), file[0:-len(SUFFIX)])
            outstring = f"---\ntitle: {title}\nband: {band}\nkey: {key}\ntags: {tags}\nslug: {slug}\n---\n{body}"

            # produce new file in /src/sheets
            outfolder = path.join(OUTPUT_FOLDER, root.replace(args.folder, ''))
            makedirs(outfolder, exist_ok=True)
            with open(path.join(outfolder, file), 'w') as wf:
                wf.write(outstring)
    # for dir in dirs:
    #     print(path.join(root, dir))


