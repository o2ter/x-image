//
//  index.js
//
//  The MIT License
//  Copyright (c) 2021 - 2025 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import _ from 'lodash';
import sharp from 'sharp';
import { Duplex } from 'stream';
import { binaryToBuffer } from '@o2ter/utils-js';
import { ImageBase, ImageData, BitmapFormat } from '../../image/base';

const instanceOf = (x: any): x is sharp.Sharp => _.isFunction(x.toBuffer) && x instanceof Duplex;

const channelsMap = {
  [BitmapFormat.Gray8]: 1,
  [BitmapFormat.RGB24]: 3,
  [BitmapFormat.RGBA32]: 4,
  [BitmapFormat.CMYK32]: 4,
} as const;

const _format = (
  { space, hasAlpha }: sharp.Metadata,
  { channels }: sharp.OutputInfo,
) => {
  switch (true) {
    case space === 'srgb' && channels === 1 && !hasAlpha: return BitmapFormat.Gray8;
    case space === 'srgb' && channels === 3 && !hasAlpha: return BitmapFormat.RGB24;
    case space === 'srgb' && channels === 4 && hasAlpha: return BitmapFormat.RGBA32;
    case space === 'cmyk' && channels === 4 && !hasAlpha: return BitmapFormat.CMYK32;
    default: throw Error('Unknown format');
  }
}

class _ImageBase extends ImageBase<sharp.Sharp> {

  constructor(data: ImageData | sharp.Sharp) {
    if (instanceOf(data)) {
      super(data);
    } else {
      const image = sharp(binaryToBuffer(data.buffer), {
        raw: {
          width: data.width,
          height: data.height,
          premultiplied: data.premultiplied,
          channels: channelsMap[data.format],
        },
      });
      super(image);
    }
  }

  async metadata() {
    return this._native.metadata();
  }

  async width() {
    const { width } = await this.metadata();
    return width ?? 0;
  }

  async height() {
    const { height } = await this.metadata();
    return height ?? 0;
  }

  async format() {
    const metadata = await this.metadata();
    const { info } = await this._native.raw({ depth: 'uchar' }).toBuffer({ resolveWithObject: true });
    return _format(metadata, info);
  }

  async colorspace() {
    const { space, icc } = await this.metadata();
    return icc ?? space;
  }

  async raw(): Promise<ImageData> {
    const metadata = await this.metadata();
    const { data, info } = await this._native.raw({ depth: 'uchar' }).toBuffer({ resolveWithObject: true });
    const format = _format(metadata, info);
    return {
      buffer: data,
      width: info.width,
      height: info.height,
      format,
      premultiplied: info.premultiplied,
      space: metadata.icc ?? metadata.space,
    };
  }

  clone() {
    return new _ImageBase(this._native.clone());
  }

}

const _loadSharp = () => ({
  instanceOf,
  ImageBase: _ImageBase,
});

export const loadSharp: () => ReturnType<typeof _loadSharp> | undefined = _loadSharp;
