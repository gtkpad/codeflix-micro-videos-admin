import { UniqueEntityId } from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import { ValidationError } from '../../../@seedwork/domain/errors/validation-error';
import { Category, CategoryProperties } from './category';

describe('[INTEGRATION]: Category', () => {
  describe('Constructor', () => {
    it('should a invalid category when create using name property', () => {
      expect(() => {
        new Category({ name: null });
      }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => {
        new Category({ name: '' });
      }).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => {
        new Category({ name: 5 as any });
      }).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => {
        new Category({ name: 't'.repeat(256) });
      }).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });

    it('should a invalid category when create using description property', () => {
      expect(() => {
        new Category({ name: 'Movie', description: 5 as any });
      }).containsErrorMessages({
        description: ['description must be a string'],
      });
    });

    it('should a invalid category when create using is_active property', () => {
      expect(() => {
        new Category({ name: 'Movie', is_active: 5 as any });
      }).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      });

      expect(() => {
        new Category({ name: 'Movie', is_active: '' as any });
      }).containsErrorMessages({
        is_active: ['is_active must be a boolean value'],
      });
    });

    it('should a invalid category when create using name property', () => {
      expect(() => {
        new Category({ name: null });
      }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => {
        new Category({ name: '' });
      }).containsErrorMessages({
        name: ['name should not be empty'],
      });

      expect(() => {
        new Category({ name: 5 as any });
      }).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => {
        new Category({ name: 't'.repeat(256) });
      }).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });
    });

    it('should a invalid category when create using description property', () => {
      expect(() => {
        new Category({ name: 'Movie', description: 5 as any });
      }).containsErrorMessages({
        description: ['description must be a string'],
      });
    });

    describe('should create a valid category', () => {
      new Category({
        name: 'Movie',
        description: 'description',
        is_active: true,
        created_at: new Date(),
      });

      new Category({ name: 'Movie' });
      new Category({ name: 'Movie', description: null });
      new Category({ name: 'Movie', is_active: false });
      new Category({ name: 'Movie', is_active: true });

      type CategoryData = { props: CategoryProperties; id?: UniqueEntityId };
      const data: CategoryData[] = [
        { props: { name: 'Movie' } },
        { props: { name: 'Movie' }, id: null },
        { props: { name: 'Movie' }, id: undefined },
        {
          props: { name: 'Movie' },
          id: new UniqueEntityId('df96eac1-52c9-4000-833b-e0de54d8c096'),
        },
      ];

      test.each(data)('should create a valid category: %j', (item) => {
        expect.assertions(0);
        new Category(item.props, item.id);
      });
    });
  });

  describe('update method', () => {
    it('should throw error on update name with invalid params', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(() => {
        category.update({ name: null });
      }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
      expect(() => {
        category.update({ name: '' });
      }).containsErrorMessages({
        name: ['name should not be empty'],
      });
      expect(() => {
        category.update({ name: 5 as any });
      }).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });

      expect(() => {
        category.update({ name: 't'.repeat(256) });
      }).containsErrorMessages({
        name: ['name must be shorter than or equal to 255 characters'],
      });

      expect(() => {
        category.update({ description: 'Movie 2' } as any);
      }).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
      });
    });

    it('should throw error on update description with invalid params', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(() => {
        category.update({ name: 'Movie 2', description: 5 as any });
      }).containsErrorMessages({
        description: [
          'description must be a string',
          'description must be shorter than or equal to 255 characters',
        ],
      });
    });

    it('should update a valid category', () => {
      expect.assertions(0);
      const category = new Category({
        name: 'Movie',
        description: 'description',
        is_active: true,
        created_at: new Date(),
      });

      category.update({ name: 'Movie2' });
      category.update({ name: 'Movie2', description: null });
    });
  });
});
