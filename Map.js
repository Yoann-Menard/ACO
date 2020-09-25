class Map {
    constructor(width = 10, height = 10) {
        this.width = width + 1;
        this.height = height + 1;
        this.hill = {x: Math.floor(Math.random() * (this.height - 2) + 1), y: Math.floor(Math.random() * (this.width - 2) + 1)};
        this.map = this.generateMap();
    }

    appendAnt = () => {
        let ant = new Ant(this.hill.x, this.hill.y);
        let phero;
        if (ant.state === "EMPTY")
            phero = "v1";
        else if (ant.state === "FULL")
            phero = "v2"
        this.render();
        
        let anterval = setInterval(() => {
            const { x, y } = ant.position;
            let choice = null;
            let possible = ant.getMovePossibility(this.map);
            let {up, down, left, right} = possible;
            phero = (ant.state === "EMPTY") ? "v1" : "v2";
            this.map[y][x].v1 = ant.majPheromone(this.map, "v1");
            this.map[y][x].v2 = ant.majPheromone(this.map, "v2");
            let antFull = (ant.state === "FULL") ? "FOURMIS1": "FOURMIS"
            if (up || down || left || right)
                choice = ant.moveRandPossible(possible, this.map);
            switch(choice) {
                case "up":
                    this.map[y][x].type = (this.map[y][x].type === "HILL") ? "HILL" : "FREE";
                    this.map[y - 1][x].type = antFull;
                    ant.position.y = y - 1;
                    break;
                case "down":
                    this.map[y][x].type = (this.map[y][x].type === "HILL") ? "HILL" : "FREE";
                    this.map[y + 1][x].type = antFull;
                    ant.position.y = y + 1
                    break;
                case "left":
                    this.map[y][x].type = (this.map[y][x].type === "HILL") ? "HILL" : "FREE";
                    this.map[y][x - 1].type = antFull;
                    ant.position.x = x - 1;
                    break;
                case "right":
                    this.map[y][x].type = (this.map[y][x].type === "HILL") ? "HILL" : "FREE";
                    this.map[y][x + 1].type = antFull;
                    ant.position.x = x + 1;
                    break;
            }

            this.render();
        }, 500);
    }

    generateMap = () => {
        let map = [];
        for (let i = 0, j = 0, x = []; j < this.height;) {
            if (!(i < this.width)) {
                map.push(x);
                j++;
                i = 0;
                x = [];
            } else if ((i === 0 || i === this.width - 1)) {
                x.push(new Case(i, j, "BLOCK"));
                i++;
            } else if ((j === 0 || j === this.height - 1)){
                x.push(new Case(i, j, "BLOCK"));
                i++;
            } else if (i < this.width) {
                if (Math.floor(Math.random() * 10))
                    x.push(new Case(i, j, "FREE"));
                else
                    x.push(new Case(i, j, "BLOCK"));
                i++;
            }
        }

        map[Math.floor(Math.random() * (this.height - 2) + 1)][Math.floor(Math.random() * (this.width - 2) + 1)].type = "FOOD";
        map[this.hill.y][this.hill.x].type = "HILL";
        return map;
    }

    render() {
        let grid = document.getElementById("grid");
        grid.innerHTML = "";
        grid.style.width = (myMap.width * 12) + "px";
        grid.style.height = (myMap.height * 12) + "px";

        for(let i = 0; i < this.map.length; i++) {
            for (let j = 0, e; j < this.map[i].length; j++) {
                e = document.createElement("div");
                e.className = "case";
                switch(this.map[i][j].type) {
                    case "BLOCK":
                        e.style.backgroundColor = "grey";
                        e.style.border = "1px solid grey";
                        break;
                    case "FOOD":
                        e.style.backgroundColor = "yellow";
                        e.style.border = "1px solid grey";
                        break;
                    case "FOURMIS":
                        e.style.backgroundColor = "black";
                        e.style.border = "1px solid black";
                        break;
                    case "FOURMIS1":
                        e.style.backgroundColor = "purple";
                        e.style.border = "1px solid black";
                        break;
                    case "HILL":
                        e.style.backgroundColor = "blue";
                        e.style.border = "1px solid blue";
                        break;
                    case "FREE":
                        if (this.map[i][j].v1.avg <= -5) {
                            e.style.backgroundColor = "red";
                            e.style.border = "1px solid black";
                        } else if (this.map[i][j].v1.avg < 0) {
                            e.style.backgroundColor = "orange";
                            e.style.border = "1px solid black";
                        }

                }
                document.getElementById("grid").appendChild(e);
            }
        }
    }
}