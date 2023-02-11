import React, { useState } from 'react';


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
            <div style={{color: 'white', backgroundColor: 'var(--item-bg)', height: 30, borderRadius: 5, padding: 5, }} onClick={handleClickCurrencyBalance}>{list_values[selected_value - 1]}</div>
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

