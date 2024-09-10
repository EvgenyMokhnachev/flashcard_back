package utils

import (
	"strconv"
	"time"
)

func IntOrNull(point *int) string {
	if point == nil {
		return "NULL"
	} else {
		return strconv.Itoa(*point)
	}
}

func StrOrNull(point *string) string {
	if point == nil {
		return "NULL"
	} else {
		return *point
	}
}

func UnixOrNull(point *time.Time) interface{} {
	if point == nil {
		return "NULL"
	} else {
		return strconv.FormatInt((*point).Unix()/1000, 10)
		//return strconv.FormatInt((*point).UnixMicro(), 10)
		//return strconv.FormatInt((*point).UnixNano(), 10)
		//return strconv.FormatInt((*point).UnixMilli(), 10)
	}
}

func BoolOrNull(point *bool) interface{} {
	if point == nil {
		return "NULL"
	} else {
		return *point
	}
}
