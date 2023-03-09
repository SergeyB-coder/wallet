export function Button (props) {
    const svg_send = 
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.364 16.364V16.364C12.849 19.879 7.15101 19.879 3.63601 16.364V16.364C0.121006 12.849 0.121006 7.151 3.63601 3.636V3.636C7.15101 0.120998 12.849 0.120998 16.364 3.636V3.636C19.879 7.151 19.879 12.849 16.364 16.364Z" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.0002 5.75736V14.2426" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.81827 8.93933L10.0002 5.75735L13.1822 8.93933" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    const svg_ptp = 
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.364 16.364V16.364C12.849 19.879 7.15101 19.879 3.63601 16.364V16.364C0.121006 12.849 0.121006 7.151 3.63601 3.636V3.636C7.15101 0.120998 12.849 0.120998 16.364 3.636V3.636C19.879 7.151 19.879 12.849 16.364 16.364Z" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.3448 9.31029L14.0002 7.65543L12.3448 6" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.00024 7.65716H14.0002" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.65567 10.6897L6.00024 12.3446L7.65567 14" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.0002 12.3428H6.00024" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>


    const svg_recieve = 
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.63601 3.636V3.636C7.15101 0.120998 12.849 0.120998 16.364 3.636V3.636C19.879 7.151 19.879 12.849 16.364 16.364V16.364C12.849 19.879 7.15101 19.879 3.63601 16.364V16.364C0.121006 12.849 0.121006 7.151 3.63601 3.636Z" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.0002 14.2426V5.75736" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.1822 11.0607L10.0002 14.2426L6.81827 11.0607" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>


    
    
    const onClick = props.onClick
    return (
        <>
            <div style={{width: '30vw'}}>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div className='button-menu' style={props.style} onClick={onClick}>
                        <div>
                            <div className="menu-button-svg-container-p">
                                <div className='menu-button-svg-container'>
                                    {/* <svg stroke="white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"  fill="" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path  fillRule="evenodd" d={props.d_svg}/>
                                    </svg> */}
                                    {
                                        props.type === 'send' ? svg_send:
                                        props.type === 'ptp' ? svg_ptp:
                                        svg_recieve
                                    }
                                </div>
                            </div>  
                            <div className='button-menu-text text-nowrap w-100'>{props.text}</div>
                        </div>
                        
                    </div>
                    
                </div>
                

                
            </div>
        </>
      );
}

