import { create } from './loader';

function load(annotate): any {
  return create(annotate);
};

export = load;
