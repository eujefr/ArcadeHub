document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("snake-container");
    const segmentCount = 25;
    const segmentSpacing = 15;
    const segments = [];
    let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let inertia = { x: 0, y: 0 };
    let moving = false;

    for (let i = 0; i < segmentCount; i++) {
        let segment = document.createElement("div");
        segment.classList.add(i === 0 ? "snake-head" : "snake-segment");

        if (i === 0) {
            let tongue = document.createElement("div");
            tongue.classList.add("snake-tongue");
            segment.appendChild(tongue);
        }

        container.appendChild(segment);
        segments.push(segment);
    }

    let positions = [];
    for (let i = 0; i < segmentCount; i++) {
        positions.push({
            x: lastMousePos.x - i * segmentSpacing,
            y: lastMousePos.y,
        });
    }

    document.addEventListener("mousemove", function (event) {
        lastMousePos = { x: event.clientX, y: event.clientY };
        moving = true;
    });

    function updateSnake() {
        if (moving) {
            inertia.x = (lastMousePos.x - positions[0].x) * 0.15;
            inertia.y = (lastMousePos.y - positions[0].y) * 0.15;
        }

        let newHeadPos = {
            x: positions[0].x + inertia.x,
            y: positions[0].y + inertia.y,
        };
        positions.unshift(newHeadPos);
        positions.pop();

        for (let i = 1; i < segmentCount; i++) {
            let dx = positions[i - 1].x - positions[i].x;
            let dy = positions[i - 1].y - positions[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > segmentSpacing) {
                let angle = Math.atan2(dy, dx);
                positions[i].x = positions[i - 1].x - Math.cos(angle) * segmentSpacing;
                positions[i].y = positions[i - 1].y - Math.sin(angle) * segmentSpacing;
            }
        }

        for (let i = 0; i < segmentCount; i++) {
            let segment = segments[i];
            let pos = positions[i];

            segment.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        }

        
        if (!moving) {
            inertia.x *= 0.95;
            inertia.y *= 0.95;

            if (Math.abs(inertia.x) < 0.1 && Math.abs(inertia.y) < 0.1) {
                moving = false;
                // Pequeno deslocamento para evitar que ela fique muito enrolada
                positions[0].x += Math.sin(Date.now() * 0.002) * 1.5;
                positions[0].y += Math.cos(Date.now() * 0.002) * 1.5;
            }
        }

        requestAnimationFrame(updateSnake);
    }

    updateSnake();
});
