export function Button (props) {

    return (
        <>
            <div className='button-menu'>
                <div>
                    <div className="menu-button-svg-container-p">
                        <div className='menu-button-svg-container'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill={props.fill_svg} class="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d={props.d_svg}/>
                            </svg>
                        </div>
                    </div>                    
                    <div className='button-menu-text'>{props.text}</div>
                </div>
            </div>
        </>
      );
}

