export function Button (props) {
    const onClick = props.onClick
    return (
        <>
            <div className='button-menu' onClick={onClick}>
                <div>
                    <div className="menu-button-svg-container-p">
                        <div className='menu-button-svg-container'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={props.fill_svg} class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d={props.d_svg}/>
                            </svg>
                        </div>
                    </div>                    
                    <div className='button-menu-text text-nowrap'>{props.text}</div>
                </div>
            </div>
        </>
      );
}

