/**
 * wa wa
 * @param {string} name
 */
function wa(name) {
    console.log('wa', name);
}


/**
 * 
 * @param {string} name
 * @param {number} age
 */

class Person {

    /**
     * 构造函数
     * @param {string} name
     * @param {number} age
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    /**
     * wa wa
     * @param {string} name
     */
    wa() {
        wa(this.name);
    }
    
}

