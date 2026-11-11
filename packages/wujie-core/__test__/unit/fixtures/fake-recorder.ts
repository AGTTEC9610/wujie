/** 模拟录屏脚本：从路径匹配规则的文件里直接读取节点属性。 */
export function readAsRecorder(node: Node): { parentNode: Node | null; ownerDocument: Document | null } {
  return { parentNode: node.parentNode, ownerDocument: node.ownerDocument };
}
