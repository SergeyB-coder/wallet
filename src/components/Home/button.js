export function Button (props) {
    const onClick = props.onClick
    return (
        <>
            <div className='button-menu' style={props.style} onClick={onClick}>
                <div>
                    <div className="menu-button-svg-container-p">
                        <div className='menu-button-svg-container'>
                            <svg stroke="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24"  fill="" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path  fillRule="evenodd" d={props.d_svg}/>
                            </svg>
                        </div>
                    </div>                    
                    {/* <div className='button-menu-text text-nowrap'>{props.text}</div> */}
                </div>
            </div>
        </>
      );
}

