import React, { useState } from 'react';

import './style.css'

export function Selecter (props) {
    const list_values = props.list_values
    const class_name = props.class_name
    const setIndex = props.setIndex
    const selected_value = props.selected_value

    const [showListCurrency, setShowListCurrency] = useState(false)

    const handleClickCurrencyBalance = () => {
        setShowListCurrency(!showListCurrency)
    }

    function handleClickCurrencyItem(index) {
        console.log(index)
        setIndex(index)
        setShowListCurrency(false)
    }

    return (
        <div style={{position: 'relative'}}>
            <div className='selected-item text-nowrap' onClick={handleClickCurrencyBalance}>{list_values[selected_value - 1]}</div>
            {showListCurrency ? 
            <div className='currency-list-select'>
                <div>
                {list_values.map((value, index) => {
                    return (
                        <div style={index !== list_values.length-1 ? {borderBottom: '1px solid var(--btn-bg-color)'}: {}} onClick={()=>{handleClickCurrencyItem(index)}} key={index} className={class_name}>
                            {value}
                        </div>
                    )
                })}
                </div>
            </div>: null}
        </div>
      );
}

