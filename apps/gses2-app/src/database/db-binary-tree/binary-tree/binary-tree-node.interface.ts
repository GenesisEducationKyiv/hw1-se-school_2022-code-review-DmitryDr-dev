export interface IBinaryTreeNode<T> {
  value: T;
  left?: IBinaryTreeNode<T> | null;
  right?: IBinaryTreeNode<T> | null;
}
