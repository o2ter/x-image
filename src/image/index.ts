//
//  index.ts
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

import { Awaitable } from '@o2ter/utils-js';
import { ImageBase, ImageData } from './base';
import { loadJimp } from '../lib/jimp';
import { loadMirada } from '../lib/mirada';
import { loadSharp } from '../lib/sharp';

export class Image {

  private _base: Awaitable<ImageBase<any> | ImageData>

  constructor(base: Awaitable<ImageBase<any> | ImageData>) {
    this._base = base;
  }

  async width() {
    const base = await this._base;
    return base instanceof ImageBase ? base.width() : base.width;
  }

  async height() {
    const base = await this._base;
    return base instanceof ImageBase ? base.height() : base.height;
  }

  async raw() {
    const base = await this._base;
    return base instanceof ImageBase ? base.raw() : base;
  }

  toJimp() {
    const { ImageBase } = loadJimp();
    return new Image((async () => new ImageBase(await this.raw()))());
  }

  toMirada() {
    return new Image((async () => {
      const { ImageBase } = await loadMirada();
      return new ImageBase(await this.raw());
    })());
  }

  toSharp() {
    const { ImageBase } = loadSharp() ?? {};
    if (!ImageBase) throw Error('Sharp is not supported');
    return new Image((async () => new ImageBase(await this.raw()))());
  }
}
