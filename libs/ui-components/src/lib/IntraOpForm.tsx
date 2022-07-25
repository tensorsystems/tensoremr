/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';

interface Props {
  register: any;
  locked: boolean;
  aclolUnplanned: boolean;
  handleChanges: (value: any) => void;
}

export const IntraOpForm: React.FC<Props> = ({
  register,
  handleChanges,
  aclolUnplanned,
  locked,
}) => {
  return (
    <div>
      <div className="mt-4">
        <label
          htmlFor="assistantName"
          className="block text-sm font-medium text-gray-700"
        >
          Assistant Name
        </label>
        <input
          type="text"
          name="assistantName"
          ref={register}
          onChange={handleChanges}
          disabled={locked}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="performOnEye"
          className="block text-sm font-medium text-gray-700"
        >
          Perform On Eye
        </label>
        <select
          id="performOnEye"
          name="performOnEye"
          ref={register}
          onChange={handleChanges}
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value={'OD'}>Right</option>
          <option value={'OS'}>Left</option>
          <option value={'OU'}>Both</option>
        </select>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Anesthesia Details
        </div>

        <hr className="mt-2" />

        <div className="text-gray-600">
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="la"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">LA</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                disabled={locked}
                name="ga"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">GA</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="retrobulbar"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Retrobulbar</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                disabled={locked}
                name="peribulbar"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Peribulbar</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                disabled={locked}
                name="subtenones"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Subtenones</span>
            </label>

            <label className="inline-flex items-center ml-4">
              <input
                type="checkbox"
                disabled={locked}
                name="topical"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Topical</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Surgery Details
        </div>

        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-5 gap-y-2 w-4/5 mt-2">
          <div className="font-semibold col-span-1">Conj flap</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="conjFlapLimbal"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Limbal</span>
            </label>
          </div>
          <div className="col-span-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="conjFlapFornix"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Fornix</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Section</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sectionLimbal"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Limbal</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sectionCorneral"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Corneral</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="sectionScleralTunnel"
                ref={register}
                onChange={handleChanges}
                disabled={locked}
              />
              <span className="ml-2">Scleral tunnel</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Capsulotomy</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="capsulotomyLinear"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Linear</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="capsulotomyCanOpener"
                ref={register}
                onChange={handleChanges}
                disabled={locked}
              />
              <span className="ml-2">Can opener</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="capsulotomyCcc"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">CCC</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">IOL Placement</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="iolPlacementBag"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Bag</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="iolSulcus"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Sulcus</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="iolBagSulcus"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">bag-sulcus</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Irodectpmy</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="irodectpmyNone"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">None</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="irodectpmyPl"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">pl</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="irodectpmySl"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">sl</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sphincterectomy"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Sphincterectomy</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Lens Extraction</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="lensExtractionIcce"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">ICCE</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="lensExtractionEcce"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">ECCE</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="lensExtractionPhaco"
                ref={register}
                onChange={handleChanges}
                disabled={locked}
              />
              <span className="ml-2">phaco</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Suture</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sutureNone"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">None</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sutureContinuous"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Continuous</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="sutureInterrupted"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Interrupted</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">Supplies used</div>

        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-4 gap-y-2 w-4/5 mt-2">
          <div className="col-span-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="drapes"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Drapes</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Irrigation solution</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="ringer"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Ringer</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="bss"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">BSS</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Visco</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="air"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Air</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="hpmc"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">HPMC</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="healon"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Healon</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Intracameral</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="pilo"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Pilo</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="adrenalin"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Adrenalin</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Subconj</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="antibiotic"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Antibiotic</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="steroid"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Steroid</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">Suture</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="suture80"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">8-0</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="suture90"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">9-0</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="suture100"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">10-0</span>
            </label>
          </div>

          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="silk"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Silk</span>
            </label>
          </div>
          <div className="col-span-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="nylon"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Nylon</span>
            </label>
          </div>
        </div>
      </div>

      <div className="page-break" />

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Intra-operative Complications
        </div>

        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-2 gap-y-2 w-1/2 mt-2">
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="pcTear"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">PC Tear</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="iridoDialysis"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Iridio-dialysis</span>
            </label>
          </div>

          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="vitreousLoss"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Vitreous Loss</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="irisDamage"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Iris damage</span>
            </label>
          </div>

          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="descematesStrip"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Descemete's strip</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="retainedCortex"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Retained cortex</span>
            </label>
          </div>

          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="endothelialDamage"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Endothelial damage</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="hyphema"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Hyphema</span>
            </label>
          </div>

          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="nucluesDrop"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Nuclues drop</span>
            </label>
          </div>

          <div className="col-span-2">
            <textarea
              name="complicationsOthers"
              placeholder="Others"
              rows={4}
              ref={register}
              onChange={handleChanges}
              disabled={locked}
              className="mt-1 p-1 pl-4 block w-full sm:text-md  border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">Vitrectomy</div>

        <hr className="mt-2" />

        <div className="mt-4">
          <select
            id="vitrectomy"
            name="vitrectomy"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={''}></option>
            <option value={'automated'}>Automated</option>
            <option value={'wick'}>Wick</option>
          </select>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">IOP</div>

        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-4 gap-y-2 w-4/5 mt-2">
          <div className="font-semibold col-span-1">Type of IOL</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="typeOfIolAc"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">AC</span>
            </label>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="typeOfIolPc"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">PC</span>
            </label>
          </div>

          <div className="font-semibold col-span-1">ACLOL</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="aclolPlanned"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Planned</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                disabled={locked}
                name="aclolUnplanned"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Unplanned</span>
            </label>
          </div>
          <div className="col-span-1">
            {aclolUnplanned && (
              <input
                type="text"
                name="unplanned"
                ref={register}
                onChange={handleChanges}
                disabled={locked}
                placeholder="Unplanned reason"
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
              />
            )}
          </div>

          <div className="font-semibold col-span-1">Model</div>
          <div className="col-span-3">
            <input
              type="text"
              name="iolModel"
              ref={register}
              onChange={handleChanges}
              disabled={locked}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Company</div>
          <div className="col-span-3">
            <input
              type="text"
              name="company"
              ref={register}
              onChange={handleChanges}
              disabled={locked}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Additional Surgical Notes
        </div>

        <hr className="mt-2" />

        <div className="mt-2 text-gray-600">
          <textarea
            name="additionalNotes"
            rows={4}
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Special Instructions
        </div>

        <hr className="mt-2" />

        <div className="mt-2 text-gray-600">
          <textarea
            name="specialInstructions"
            rows={4}
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
