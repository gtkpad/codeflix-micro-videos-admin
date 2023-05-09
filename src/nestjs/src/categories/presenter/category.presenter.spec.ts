import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from './category.presenter';

describe('[UNIT] CategoryPresenter', () => {
  describe('contructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      expect(presenter.id).toBe('df96eac1-52c9-4000-833b-e0de54d8c096');
      expect(presenter.name).toBe('movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      });

      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: 'df96eac1-52c9-4000-833b-e0de54d8c096',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});
