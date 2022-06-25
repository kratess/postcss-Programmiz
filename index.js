const postcss = require('postcss')

/**
 * @type {import('postcss').PluginCreator}
 */
variables = {}

module.exports = (opts = {}) => {
  // Work with options here

  return {
    postcssPlugin: 'postcss-programmiz',
    
    /*Root (root, postcss) {

    },*/

    
    Declaration (decl, /*postcss*/) {
      const { prop, value } = decl

      //console.log(prop, value)

      if (prop[0] === "$") {
        //list
        if (/^list\(.*\)$/.test(value)) {
          const groups = value.substring(5, value.length-1).match(/([^, ]+)/g);

          variables[prop] = groups;
        } else {
          variables[prop] = value
        }

        decl.remove()
      }

      //console.log("variables", variables)
      //console.log("value--> ", value)

      if (value.includes("$")) {
        //console.log("%&%$% -- ", variables, value.substring(1))

        Object.keys(variables).forEach((key) => {
          //console.log("variable",key,variables[key])
          decl.value = value.split(key).join(variables[key]);
        })
      }
    },

    AtRule: {
      for: (rule) => {
        if (/^\$(.+) from (\d) to (\d+)$/.test(rule.params)) {
          const groups = rule.params.match(/^\$(.+) from (\d) to (\d+)$/).splice(1, 4);
          //console.log(groups)

          //console.log(rule.nodes[0])


          for (let i = parseInt(groups[1]); i < parseInt(groups[2]); i++) {
            //variables[groups[0]] = i
            //const defaultValues = rule.nodes.map(el => el.value)

            rule.nodes.forEach(node => {

              /*node.nodes.forEach((el) => {
                console.log("replace with", i, el.value)
                el.value = el.value.replace("$"+groups[0], i)
                console.log("--replace value", el.value, "$"+groups[0], i)
              })*/

              //console.log(node.nodes[0].value)
              const proxy = postcss.rule({ nodes: [node] });
              for (let i = 0; i < proxy.nodes[0].nodes.length; i++) {
                proxy.nodes[0].nodes[i].value = proxy.nodes[0].nodes[i].value.split("$"+groups[0]).join(i);
              }
              //const { root } = postcss([]).process(proxy);
              //console.log(proxy, root)
              //rule.parent.insertBefore(rule, root.nodes[0].nodes[0]);
              //console.log(proxy.nodes[0])
              rule.parent.insertBefore(rule, proxy.nodes[0]);
            });

            //rule.nodes.forEach((el, i) => el.value = defaultValues[i])
          }

          //console.log(variables)

          rule.remove();
        }
      },

      each: (rule) => {
        if (/^\$(.+) in (.+)$/.test(rule.params)) {
          const groups = rule.params.match(/^\$(.+) in (.+)$/).slice(1, 3);

          var arr = [];
          if (groups[1][0] === "$") {
            arr = variables[groups[1]];
          }

          arr.forEach(el => {
            rule.nodes.forEach(node => {
              const proxy = postcss.rule({ nodes: [node] });
              for (let i = 0; i < proxy.nodes[0].nodes.length; i++) {
                proxy.nodes[0].nodes[i].value = proxy.nodes[0].nodes[i].value.split("$"+groups[0]).join(el);
              }
              rule.parent.insertBefore(rule, proxy.nodes[0]);
            });
          })

          rule.remove();
        }
      }
    }
    


    
  }
}

module.exports.postcss = true