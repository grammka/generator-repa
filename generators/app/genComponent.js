module.exports = function (params) {
  let content = `
import React from 'react'
  
export default class ${params.componentName} extends React.Component {
  render() {
    return (
      <div>Component</div>
    )
  }
}
`;
  
  content = content.trim() + '\n';
  
  return content;
};
