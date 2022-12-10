import React, { useCallback, useRef } from 'react'
import { Button } from 'antd'
import 'react-photoswipe/dist/photoswipe.css'
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe.css'
import PhotoSwipe from 'photoswipe'

const items = [

]
const options = {}

function Demo() {
    const photoRef = useRef();
    useCallback(() => {
        const photoSwipe = new Photoswipe(
            photoRef.current,
            PhotoswipeUIDefault,
            items,
            options,
        )
        photoSwipe.init()
    }, [])
    
    return <div>
        <Button>测试</Button>
        <div ref={photoRef}>图片</div>
    </div>
}

export default Demo