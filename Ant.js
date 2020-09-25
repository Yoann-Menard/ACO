class Ant {
    constructor(x, y) {
        this.state = "EMPTY";
        this.position = {x, y};
        this.exploration = 0.2;
        this.confiance = 0.8;
    }

    getMovePossibility = (environment) => {
        const { x, y } = this.position;
        const possibility = {up: false, down: false, right: false, left: false}
        if (!(environment[y][x - 1].type !== "FREE"))
            possibility.left = true;
        if (!(environment[y][x + 1].type !== "FREE"))
            possibility.right = true;
        if (!(environment[y - 1][x].type !== "FREE"))
            possibility.up = true;
        if (!(environment[y + 1][x].type !== "FREE"))
            possibility.down = true;
        return possibility;
    }

    moveRandPossible = (possibility, environment) => {
        let ps = [];
        let maxAvg = -10;
        let avgEnv = [];
        let nextMove = "stay";
        const { x, y } = this.position;
        let phero = (this.state === "EMPTY") ? "v1" : "v2";
        for (const k in possibility) {
            if (possibility[k]) {
                switch(k) {
                    case "up":
                        if (environment[y - 1][x][phero].avg > maxAvg){   
                            avgEnv.unshift(environment[y - 1][x]);
                            nextMove = k;
                            maxAvg = environment[y - 1][x][phero].avg;
                        }
                        break;
                    case "down":
                        if (environment[y + 1][x][phero].avg > maxAvg){
                            avgEnv.unshift(environment[y + 1][x]);
                            nextMove = k;
                            maxAvg = environment[y + 1][x][phero].avg;
                        }
                        break;
                    case "right":
                        if (environment[y][x + 1][phero].avg > maxAvg) {
                            avgEnv.unshift(environment[y][x + 1]);
                            nextMove = k;
                            maxAvg = environment[y][x + 1][phero].avg;
                        }
                        break;
                    case "left":
                        if (environment[y + 1][x - 1][phero].avg > maxAvg) {
                            avgEnv.unshift(environment[y][x - 1]);
                            nextMove = k;
                            maxAvg = environment[y][x - 1][phero].avg;
                        }
                        break;
                }
            }
        }
    
        for (const p in possibility) {
            if (possibility[p])
                ps.unshift(p);
        }
        return this.moveToThisCase(ps, nextMove);
    }

    moveToThisCase = (possibility, nextMove) => { 
        if (Math.random() < this.exploration && Math.random() < this.confiance) {
            return possibility[Math.round(Math.random() * (possibility.length - 1))];
        }
        else if (possibility.length === 0) {
            return "stay";
        }
        else {
            return nextMove;
        }
    }

    majPheromone = (environment, phero = (this.state === "EMPTY") ? "v1" : "v2") => {
        const { x, y } = this.position;
        let total = 0;
        if (this.isFood(environment) && this.state === "EMPTY") {
            this.pickFood();
        } else if (this.isHill(environment) && this.state === "FULL") {
            this.giveFood();
        }
        let avgEnv = [
            environment[y][x - 1][phero].avg,
            environment[y][x + 1][phero].avg,
            environment[y + 1][x][phero].avg,
            environment[y - 1][x][phero].avg
        ]
        let {avg, count} = environment[y][x][phero];
        for (let i = 0; i < avgEnv.length; i++)
            total += avgEnv[i];
        let average = total / 4;
        if (phero === "v1") {
            if (this.isHill(environment))
                return {avg: -10, count: count + 1};
            return {avg: (this.isFood(environment)) ? 10 : ((avg * count) + average) / (count + 1), count: count + 1};
        }
        else if (phero === "v2"){
            if (this.isFood(environment))
                return {avg: -10, count: count + 1};
            return {avg: (this.isHill(environment)) ? 10 : ((avg * count) + average) / (count + 1), count: count + 1};
        }
    };

    pickFood = () => {
        this.state = "FULL";
    }

    giveFood = () => {
        this.state = "EMPTY";
    }

    isFood = (environment) => {
        const { x, y } = this.position;
        if (environment[y][x - 1].type === "FOOD")
            return true;
        else if (environment[y][x + 1].type === "FOOD")
            return true;
        else if (environment[y - 1][x].type === "FOOD")
            return true;
        else if (environment[y + 1][x].type === "FOOD")
            return true;
        else
            return false;
    }
    
    isHill = (environment) => {
        const { x, y } = this.position;
        if (environment[y][x - 1].type === "HILL")
            return true;
        else if (environment[y][x + 1].type === "HILL")
            return true;
        else if (environment[y - 1][x].type === "HILL")
            return true;
        else if (environment[y + 1][x].type === "HILL")
            return true;
        else
            return false;
    }
}