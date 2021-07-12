import React from 'react'

export interface Props {
    value: any
    label: string
    handleChange: any
    handleBlur: any
    handleFocus: any
    readOnly: boolean
    prepend?: string
    extraText?: string
}