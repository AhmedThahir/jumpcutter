/**
 * @license
 * Copyright (C) 2021, 2022  WofWca <wofwca@protonmail.com>
 *
 * This file is part of Jump Cutter Browser Extension.
 *
 * Jump Cutter Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jump Cutter Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Jump Cutter Browser Extension.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { TimeDelta } from "@/helpers"

/**
 * Takes audio and outputs its loudness.
 */
export default class VolumeFilterNode extends AudioWorkletNode {
  constructor(context: AudioContext, maxSmoothingWindowLength: TimeDelta, smoothingWindowLength: TimeDelta) {
    super(context, 'VolumeFilter', {
      outputChannelCount: [1],
      // TODO see the same comment in `SilenceDetectorNode.ts`.
      // processorOptions: {
      //   maxSmoothingWindowLength,
      // },
      parameterData: {
        smoothingWindowLength,
      },
    });
  }
}
