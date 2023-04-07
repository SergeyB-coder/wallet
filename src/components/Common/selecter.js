import React, { useState } from 'react';

import './style.css'

export function Selecter (props) {
    const list_values = props.list_values
    const class_name = props.class_name
    const setIndex = props.setIndex
    const selected_value = props.selected_value
    const is_show = props.is_show === undefined ? true: props.is_show

    const [showListCurrency, setShowListCurrency] = useState(false)

    const handleClickCurrencyBalance = () => {
        props.setSelecter()
        setShowListCurrency(!showListCurrency)
    }

    function handleClickCurrencyItem(index) {
        console.log(index)
        setIndex(index)
        setShowListCurrency(false)
    }

    return (
        <div className=''>
            <div className='selected-item text-nowrap' onClick={handleClickCurrencyBalance}>{list_values[selected_value - 1]}</div>
            {showListCurrency && is_show ? 
            <div className='currency-list-select'>
                <div>
                {list_values.map((value, index) => {
                    return (
                        <div style={index !== list_values.length-1 ? {borderBottom: '1px solid var(--btn-bg-color)'}: {}} onClick={()=>{handleClickCurrencyItem(index)}} key={index} className={class_name + ' selected-item'}>
                            {value}
                        </div>
                    )
                })}
                </div>
            </div>: null}
        </div>
      );
}

