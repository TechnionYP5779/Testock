import { CourseIdPipe } from './course-id.pipe';

describe('CourseIdPipe', () => {
  it('create an instance', () => {
    const pipe = new CourseIdPipe();
    expect(pipe).toBeTruthy();
  });
});
