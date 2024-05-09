//
//  index.js
//
//  The MIT License
//  Copyright (c) 2021 - 2024 O2ter Limited. All rights reserved.
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
import { ImageBase, channelsMap, ImageData, Channels } from '../../image/base';

const instanceOf = (x: any): x is sharp.Sharp => _.isFunction(x.toBuffer) && x instanceof Duplex;

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
          channels: channelsMap[data.channels],
        },
      });
      super(image);
    }
  }

  async raw(): Promise<ImageData> {
    const {
      data,
      info: {
        width,
        height,
        channels,
        premultiplied,
      }
    } = await this._native
      .raw()
      .toBuffer({ resolveWithObject: true });
    return {
      buffer: data,
      width,
      height,
      channels: channels === 1 ? Channels.Gray : Channels.RGBA,
      premultiplied,
    };
  }
}

const _loadSharp = () => ({
  instanceOf,
  ImageBase: _ImageBase,
});

export const loadSharp: () => ReturnType<typeof _loadSharp> | undefined = _loadSharp;
