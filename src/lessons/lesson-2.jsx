import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
const Lesson2 = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef) return;
    const dataSource = "https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json";
    (async function () {
      const data = await (await fetch(dataSource)).json();
      // d3 hierarchy 将省份数据按包含城市的数量排序
      const regions = d3
        .hierarchy(data)
        .sum((d) => 1)
        .sort((a, b) => b.value - a.value);
      // 我们要将它们展现在一个画布宽高为 1600 * 1600 的 Canvas 中，
      //那我们可以通过 d3.pack() 将数据映射为一组 1600 宽高范围内的圆形。不过，为了展示得美观一些，在每个相邻的圆之间我们还保留 3 个像素的 padding
      const pack = d3.pack().size([1000, 1000]).padding(3);
      const root = pack(regions);

      const context = canvasRef.current.getContext("2d");
      const TAU = 2 * Math.PI;
      // 递归画就好啦
      function draw(
        ctx,
        node,
        posX,
        posY,
        fillStyle = "rgba(0,0,0,0.2)",
        textColor = "white"
      ) {
        const children = node.children;
        const { x, y, r } = node;
        const isContain =
          posX && posY && Math.abs(posX - x) < 10 && Math.abs(posY - y) < 10;
        ctx.fillStyle = isContain ? "red" : fillStyle;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
        if (children) {
          children.forEach((v) => {
            draw(ctx, v, posX, posY);
          });
        } else {
          const name = node.data.name;
          ctx.fillStyle = textColor;
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(name, x, y);
        }
      }
      draw(context, root);

      const MARGIN_TOP = 140;
      const MARGIN_LEFT = canvasRef.current.offsetLeft;
      // 通常 页面不止一个canvas。可能有其他dom。会导致难以计算
      canvasRef.current.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        const posX = clientX - MARGIN_LEFT;
        const posY = clientY - MARGIN_TOP;
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        draw(context, root, posX, posY);
      });
    })();
  }, [canvasRef]);
  return (
    <div>
      <h1>使用 Canvas d3 画出层级关系图，有交互</h1>
      <canvas width="1000" height="1000" ref={canvasRef}></canvas>
    </div>
  );
};

export default Lesson2;
