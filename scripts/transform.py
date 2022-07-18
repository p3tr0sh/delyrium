#!/usr/bin/env python3

from os import walk,path,makedirs
from argparse import ArgumentParser

SUFFIX = ".md"
OUTPUT_FOLDER = "src/sheets/"

FOLDER_IGNORES = [OUTPUT_FOLDER, "node_modules", "delyrium", ".git"]

parser = ArgumentParser()
parser.add_argument('folder', type=str)
args = parser.parse_args()

# crawl over /lyr-sheets

for root, dirs, files in walk(args.folder):
    x = sum([1 for ignore in FOLDER_IGNORES if ignore in root])
    if x > 0:
        continue

    files.sort()
    for file in files:
        filepath = path.join(root, file)
        print(filepath)
        if not filepath.endswith(SUFFIX) or filepath.endswith("README.md"):
            continue
        title, band, key, tags, columns = ['', '', '', '', 2]
        with open(filepath, 'r') as f:
            while f.readable():
                line = f.readline().replace('\n', '')
                spl = line.split(' ', 1)
                if line.startswith('#!'):
                    # ignore shebang, maybe grab the "column" argument?
                    p = ArgumentParser()
                    p.add_argument("-c", "--pdf-columns", type=int, default=2)
                    a = line.replace("#!/usr/bin/env lyr", "").replace("#!/bin/lyr", "").split(" ")
                    a.remove('')
                    lyrArgs = p.parse_args(a)
                    columns = lyrArgs.pdf_columns
                    continue
                if line.startswith('---'):
                    # header end
                    break
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
            outstring = f"---\ntitle: {title}\nband: {band}\nkey: {key}\ntags: {tags}\ncolumns: {columns}\nslug: {slug}\n---\n{body}"

            # produce new file in /src/sheets
            outfolder = path.join(OUTPUT_FOLDER, root.replace(args.folder, ''))
            makedirs(outfolder, exist_ok=True)
            with open(path.join(outfolder, file), 'w') as wf:
                wf.write(outstring)
