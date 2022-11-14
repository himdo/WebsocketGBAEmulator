import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const canvasRef = useRef(null)

  const draw = (ctx, frameCount) => {
    let frameData = props.framedata
    if (typeof frameData === 'undefined') return
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    // ctx.fillStyle = '#000000'
    // ctx.beginPath()
    for (let i = 0; i < frameData.length; i+=4) {
      data[i]     = frameData[i];
      data[i+1]   = frameData[i+1];
      data[i+2]   = frameData[i+2];
      data[i+3]   = frameData[i+3];
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.fill()
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas