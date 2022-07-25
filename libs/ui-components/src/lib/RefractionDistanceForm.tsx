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

import RefractionInput from './RefractionInput';

export const RefractionDistanceComponent = ({
  register,
  values,
  readonly,
  onChange,
}: {
  register: any;
  values: any;
  onChange?: () => void;
  readonly?: boolean;
}) => {
  const hasSubjective =
    values.rightDistanceSubjectiveSph ||
    values.rightDistanceSubjectiveCyl ||
    values.rightDistanceSubjectiveAxis ||
    values.leftDistanceSubjectiveSph ||
    values.leftDistanceSubjectiveCyl ||
    values.leftDistanceSubjectiveAxis;

  const hasObjective =
    values.rightDistanceObjectiveSph ||
    values.rightDistanceObjectiveCyl ||
    values.rightDistanceObjectiveAxis ||
    values.leftDistanceObjectiveSph ||
    values.leftDistanceObjectiveCyl ||
    values.leftDistanceObjectiveAxis;

  return (
    <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center border p-2 rounded-md">
      <div hidden={readonly && !hasSubjective} className="col-span-1">
        <p className="text-gray-600 tracking-wide text-sm">Subjective</p>
      </div>
      <div hidden={readonly && !hasSubjective} className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.rightDistanceSubjectiveSph}
              name="rightDistanceSubjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceSubjectiveCyl}
              name="rightDistanceSubjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceSubjectiveAxis}
              name="rightDistanceSubjectiveAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div hidden={readonly && !hasSubjective} className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.leftDistanceSubjectiveSph}
              name="leftDistanceSubjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceSubjectiveCyl}
              name="leftDistanceSubjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceSubjectiveAxis}
              name="leftDistanceSubjectiveAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div hidden={readonly && !hasObjective} className="col-span-1">
        <p className="text-gray-600 tracking-wide text-sm">Objective</p>
      </div>
      <div hidden={readonly && !hasObjective} className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.rightDistanceObjectiveSph}
              name="rightDistanceObjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceObjectiveCyl}
              name="rightDistanceObjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceObjectiveAxis}
              name="rightDistanceObjectiveAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div hidden={readonly && !hasObjective} className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.leftDistanceObjectiveSph}
              name="leftDistanceObjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceObjectiveCyl}
              name="leftDistanceObjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceObjectiveAxis}
              name="leftDistanceObjectiveAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <p className="text-gray-600 tracking-wide text-sm">Final Rx</p>
      </div>
      <div className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.rightDistanceFinalSph}
              name="rightDistanceFinalSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceFinalCyl}
              name="rightDistanceFinalCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightDistanceFinalAxis}
              name="rightDistanceFinalAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.leftDistanceFinalSph}
              name="leftDistanceFinalSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceFinalCyl}
              name="leftDistanceFinalCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftDistanceFinalAxis}
              name="leftDistanceFinalAxis"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
