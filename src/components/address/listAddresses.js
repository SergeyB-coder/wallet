
import { list_svg_logos, list_token_names } from "../../const/devdata";



export function ListAddreses(props) {
    const setShowListAddresses = props.setShowListAddresses
    const selectedTokenIndex = props.selectedTokenIndex
    const setSelectedTokenIndex = props.setSelectedTokenIndex
    const tokens = [1, 2, 3]

    

    const handleClickAddresItem = (index) => {
        console.log('handleClickAddresItem', index)
        setSelectedTokenIndex(index)
        setShowListAddresses(false)
    }

    return (
        <div>
            {
                tokens.map((token, index) => {
                    return (
                        <div style={{display: index === selectedTokenIndex ? 'none': 'flex'}} 
                            className='row-2 color-bg-address h-60 a-c p-17 w-100 color-bg-cntr' onClick={()=>handleClickAddresItem(index)}
                        >


                            <div className='row p-0 m-0'>
                                {/* <div className='address-circle'></div> */}
                                <div className='svg-circle'>{list_svg_logos[index]}</div>
                                <div className='send-text text-nowrap'>{list_token_names[index]}</div>
                            </div>

                            <div className='address-item-col2'>
                                {/* <svg onClick={handleClickSelectAddress} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"/>
                                        </svg> */}
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}