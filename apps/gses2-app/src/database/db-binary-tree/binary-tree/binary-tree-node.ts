import { IBinaryTreeNode } from './binary-tree-node.interface';

export class BinaryTreeNode<T> implements IBinaryTreeNode<T> {
  public value: T;

  public left?: IBinaryTreeNode<T> | null;

  public right?: IBinaryTreeNode<T> | null;

  constructor(value: T, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}
