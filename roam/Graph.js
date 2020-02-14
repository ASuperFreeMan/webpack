import { Dictionary } from './Dictionary';

export class Graph {
    constructor() {
        this.vertices = []; // 用来存放图中的顶点
        this.adjList = new Dictionary(); // 用来存放图中的边
    }

    // 向图中添加一个新顶点
    addVertex(v) {
        if (!this.vertices.includes(v)) {
            this.vertices.push(v);
            this.adjList.add(v, []);
        }
    }

    // 向图中添加a和b两个顶点之间的边
    addEdge(a, b) {
        // 如果图中没有顶点a，先添加顶点a
        if (!this.adjList.Exists(a)) {
            this.addVertex(a);
        }
        // 如果图中没有顶点b，先添加顶点b
        if (!this.adjList.Exists(b)) {
            this.addVertex(b);
        }

        this.adjList.getItem(a).push(b); // 在顶点a中添加指向顶点b的边
        this.adjList.getItem(b).push(a); // 在顶点b中添加指向顶点a的边
    }

    // 获取图的vertices
    getVertices() {
        return this.vertices;
    }

    // 获取图中的adjList
    getAdjList() {
        return this.adjList;
    }

    getItem(key) {
        return this.adjList.getItem(key);
    }

    getKeyByValue(value) {
        return this.adjList.getKeyByValue(value);
    }

    remove(key) {
        this.adjList.remove(key);
    }

    setVertex(key, value) {
        this.adjList.set(key, value);
    }

    toString() {
        let s = '';
        this.vertices.forEach((v) => {
            s += `${v} -> `;
            this.adjList.getItem(v).forEach((n) => {
                s += `${n} `;
            });
            s += '\n';
        });
        return s;
    }
}