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

import _ from 'lodash';
import { Awaitable, binaryToBuffer } from '@o2ter/utils-js';
import { ImageBase, ImageData } from './base';
import { loadJimp } from '../lib/jimp';
import { loadOpenCV } from '../lib/opencv';
import { loadSharp } from '../lib/sharp';

type _Base = Awaitable<ImageBase<any> | ImageData>;

export class Image {

  private _base: _Base

  constructor(base: _Base | (() => _Base)) {
    this._base = _.isFunction(base) ? base() : base;
  }

  async width() {
    const base = await this._base;
    return base instanceof ImageBase ? base.width() : base.width;
  }

  async height() {
    const base = await this._base;
    return base instanceof ImageBase ? base.height() : base.height;
  }

  async format() {
    const base = await this._base;
    return base instanceof ImageBase ? base.format() : base.format;
  }

  async colorspace() {
    const base = await this._base;
    return base instanceof ImageBase ? base.colorspace() : base.space;
  }

  async raw() {
    const base = await this._base;
    return base instanceof ImageBase ? base.raw() : base;
  }

  clone() {
    return new Image(async () => {
      const base = await this._base;
      return base instanceof ImageBase ? base.clone() : { ...base, buffer: binaryToBuffer(base.buffer) };
    });
  }

  async destory() {
    const base = await this._base;
    if (base instanceof ImageBase) base.destory();
  }

  private _anyImage() {
    const { instanceOf, ImageBase } = loadSharp() ?? loadJimp();
    if (instanceOf(this._base)) return this;
    return new Image(async () => new ImageBase(await this.raw()));
  }

  toJimp() {
    const { instanceOf, ImageBase } = loadJimp();
    if (instanceOf(this._base)) return this;
    return new Image(async () => new ImageBase(await this.raw()));
  }

  toSharp() {
    const { instanceOf, ImageBase } = loadSharp() ?? {};
    if (!instanceOf || !ImageBase) throw Error('Sharp is not supported');
    if (instanceOf(this._base)) return this;
    return new Image(async () => new ImageBase(await this.raw()));
  }

  toOpenCV() {
    return new Image(async () => {
      const { instanceOf, ImageBase } = await loadOpenCV();
      if (instanceOf(this._base)) return this._base;
      return new ImageBase(await this.raw());
    });
  }
}
