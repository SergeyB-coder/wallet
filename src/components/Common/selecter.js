import React, { useState } from 'react';


export function Selecter (props) {
    const list_values = props.list_values
    const class_name = props.class_name
    const setValue = props.setValue
    const selected_value = props.selected_value

    const [showListCurrency, setShowListCurrency] = useState(false)

    const handleClickCurrencyBalance = () => {
        setShowListCurrency(!showListCurrency)
    }

    function handleClickCurrencyItem(index) {
        console.log(index)
        setValue(list_values[index])
        setShowListCurrency(false)
    }

    return (
        <div style={{position: 'relative'}}>
            <div style={{color: 'white'}} onClick={handleClickCurrencyBalance}>{selected_value}</div>
            {showListCurrency ? 
            <div className='currency-list-select'>
                <div>
                {list_values.map((value, index) => {
                    return (
                        <div onClick={()=>{handleClickCurrencyItem(index)}} key={index} className={class_name}>{value}</div>
                    )
                })}
                </div>
            </div>: null}
        </div>
      );
}

