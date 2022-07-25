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

export const RefractionNearComponent = ({
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
    values.righNearSubjectiveSph ||
    values.righNearSubjectiveCyl ||
    values.righNearSubjectiveAxis ||
    values.lefNearSubjectiveSph ||
    values.lefNearSubjectiveCyl ||
    values.lefNearSubjectiveAxis;

  const hasObjective =
    values.righNearObjectiveSph ||
    values.righNearObjectiveCyl ||
    values.righNearObjectiveAxis ||
    values.lefNearObjectiveSph ||
    values.lefNearObjectiveCyl ||
    values.lefNearObjectiveAxis;

  return (
    <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center border p-2 rounded-md">
      <div hidden={readonly && !hasSubjective} className="col-span-1">
        <p className="text-gray-600 tracking-wide text-sm">Subjective</p>
      </div>
      <div hidden={readonly && !hasSubjective} className="col-span-4">
        <div className="flex space-x-3 justify-around">
          <div>
            <RefractionInput
              value={values.rightNearSubjectiveSph}
              name="rightNearSubjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearSubjectiveCyl}
              name="rightNearSubjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearSubjectiveAxis}
              name="rightNearSubjectiveAxis"
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
              value={values.leftNearSubjectiveSph}
              name="leftNearSubjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearSubjectiveCyl}
              name="leftNearSubjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearSubjectiveAxis}
              name="leftNearSubjectiveAxis"
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
              value={values.rightNearObjectiveSph}
              name="rightNearObjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearObjectiveCyl}
              name="rightNearObjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearObjectiveAxis}
              name="rightNearObjectiveAxis"
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
              value={values.leftNearObjectiveSph}
              name="leftNearObjectiveSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearObjectiveCyl}
              name="leftNearObjectiveCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearObjectiveAxis}
              name="leftNearObjectiveAxis"
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
              value={values.rightNearFinalSph}
              name="rightNearFinalSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearFinalCyl}
              name="rightNearFinalCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.rightNearFinalAxis}
              name="rightNearFinalAxis"
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
              value={values.leftNearFinalSph}
              name="leftNearFinalSph"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearFinalCyl}
              name="leftNearFinalCyl"
              register={register}
              readOnly={readonly}
              onChange={onChange}
            />
          </div>
          <div>
            <RefractionInput
              value={values.leftNearFinalAxis}
              name="leftNearFinalAxis"
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
