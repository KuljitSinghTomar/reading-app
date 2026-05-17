#!/usr/bin/env python3
"""
Generate phoneme audio files using Google Cloud Text-to-Speech with IPA SSML.
Run from the reading-app-ios directory:
  python3 scripts/generate_phonemes.py --key YOUR_GOOGLE_API_KEY
"""

import os
import sys
import json
import base64
import argparse
import time
import urllib.request
import urllib.error

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds', 'phonemes')

# Each entry: (filename, IPA phoneme, display text for SSML fallback)
# IPA reference: https://cloud.google.com/text-to-speech/docs/ssml#phoneme
PHONEMES = [
    # Phase 1
    ('s',  's',    's'),
    ('a',  'æ',    'a'),
    ('t',  't',    't'),
    ('p',  'p',    'p'),
    ('m',  'm',    'm'),
    # Phase 2
    ('i',  'ɪ',    'i'),
    ('d',  'd',    'd'),
    ('n',  'n',    'n'),
    ('g',  'ɡ',    'g'),
    ('o',  'ɑ',    'o'),
    # Phase 3
    ('c',  'k',    'c'),
    ('k',  'k',    'k'),
    ('e',  'ɛ',    'e'),
    ('r',  'ɹ',    'r'),
    ('u',  'ʌ',    'u'),
    ('l',  'l',    'l'),
    ('h',  'h',    'h'),
    ('f',  'f',    'f'),
    ('b',  'b',    'b'),
    # Phase 4 digraphs
    ('sh', 'ʃ',    'sh'),
    ('ch', 'tʃ',   'ch'),
    ('th', 'ð',    'th'),
    ('wh', 'w',    'wh'),
    ('ck', 'k',    'ck'),
    ('ll', 'l',    'll'),
    ('ss', 's',    'ss'),
    ('ff', 'f',    'ff'),
    # Phase 5
    ('w',  'w',    'w'),
    ('v',  'v',    'v'),
    ('y',  'j',    'y'),
    ('z',  'z',    'z'),
    ('x',  'ks',   'x'),
]

VOICE = 'en-US-Neural2-F'
SPEAKING_RATE = 0.8


def generate(api_key: str, name: str, ipa: str, display: str) -> bool:
    ssml = f'<speak><phoneme alphabet="ipa" ph="{ipa}">{display}</phoneme></speak>'

    payload = json.dumps({
        'input': {'ssml': ssml},
        'voice': {'languageCode': 'en-US', 'name': VOICE},
        'audioConfig': {
            'audioEncoding': 'MP3',
            'speakingRate': SPEAKING_RATE,
        },
    }).encode('utf-8')

    url = f'https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}'
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            audio = base64.b64decode(data['audioContent'])
            out_path = os.path.join(OUTPUT_DIR, f'{name}.mp3')
            with open(out_path, 'wb') as f:
                f.write(audio)
            print(f'  ✓  {name}.mp3  ({len(audio):,} bytes)')
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'  ✗  {name}: HTTP {e.code} — {body}')
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--key', required=True, help='Google Cloud API key')
    parser.add_argument('--only', help='Generate only this letter (e.g. --only s)')
    args = parser.parse_args()

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    targets = PHONEMES
    if args.only:
        targets = [p for p in PHONEMES if p[0] == args.only.lower()]
        if not targets:
            print(f'No phoneme found for "{args.only}"')
            sys.exit(1)

    print(f'Generating {len(targets)} phoneme file(s) → {os.path.abspath(OUTPUT_DIR)}\n')
    ok = 0
    for name, ipa, display in targets:
        if generate(args.key, name, ipa, display):
            ok += 1
        time.sleep(0.1)  # stay well within rate limits

    print(f'\n{ok}/{len(targets)} files generated successfully.')
    if ok < len(targets):
        sys.exit(1)


if __name__ == '__main__':
    main()
