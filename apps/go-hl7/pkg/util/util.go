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

package util

import (
	"fmt"
	"strconv"
	"time"
)

func LeftZeroPad(number, padWidth int) string {
	return fmt.Sprintf(fmt.Sprintf("%%0%dd", padWidth), number)
}

func FormatHl7Date(date time.Time) string {
	year, month, day := date.Date()
	return strconv.Itoa(year) + LeftZeroPad(int(month), 2) + LeftZeroPad(day, 2)
}
