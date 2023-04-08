import { MoviesService } from '../movies.service';
import { MoviesRepository } from '../movies.repository';
import { Movie } from '../../../shared/interfaces/movie.interface';
import { MovieCreateDto } from '../dto/create.dto';
import { FileService } from '../../file/file.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

let movie: Movie = {
  id: 'mongoId',
  movieId: 21651561,
  src: '/uploads/movie/my-video.mp4',
  description: 'best movie and ...',
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('MoviesService', function () {
  let moviesService: MoviesService;
  let moviesRepository: MoviesRepository;
  let fileService: FileService;

  beforeEach(() => {
    moviesRepository = new MoviesRepository(jest.fn() as any);
    fileService = new FileService();
    moviesService = new MoviesService(moviesRepository, fileService);
  });

  it('should defined', () => {
    expect(moviesService).toBeDefined();
  });

  describe('create()', function () {
    it("should throw 'MOVIE_IS_DUPLICATE',when src is duplicate", async () => {
      jest
        .spyOn(moviesRepository, 'getBySrc')
        .mockImplementation(async () => movie);
      const input: MovieCreateDto = {
        src: movie.src,
        description: movie.src,
      };
      await expect(moviesService.create(input)).rejects.toThrow(
        'MOVIE_IS_DUPLICATE',
      );
    });
    it("should throw 'SRC_INVALID', when src file not found", async () => {
      jest
        .spyOn(moviesRepository, 'getBySrc')
        .mockImplementation(async () => null);
      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => false);
      const input: MovieCreateDto = {
        src: movie.src,
        description: movie.src,
      };
      await expect(moviesService.create(input)).rejects.toThrow('SRC_INVALID');
    });
    it('should create movie and return movie', async () => {
      jest
        .spyOn(moviesRepository, 'getBySrc')
        .mockImplementation(async () => null);
      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => true);

      jest
        .spyOn(moviesRepository, 'create')
        .mockImplementation(async () => movie);

      await expect(
        moviesService.create({
          src: movie.src,
          description: movie.description,
        }),
      ).resolves.toEqual(movie);
    });
  });

  describe('deleteByMovieId()', function () {
    it("should throw 'MOVIE_NOT_FOUND',when movie not found", async () => {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(() => null);
      await expect(moviesService.deleteByMovieId(1)).rejects.toThrow(
        new NotFoundException('MOVIE_NOT_FOUND'),
      );
    });
    it('should call method removeByPath,when src file is exists', async () => {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(async () => movie);

      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => true);

      jest
        .spyOn(fileService, 'removeByPath')
        .mockImplementation(async () => {});

      jest
        .spyOn(moviesRepository, 'deleteByMovieId')
        .mockImplementation(async () => movie);

      await moviesService.deleteByMovieId(1);

      await expect(fileService.removeByPath).toBeCalled();
    });
    it('should not call method removeByPath,when src file is not exists', async () => {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(async () => movie);

      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => false);

      jest
        .spyOn(fileService, 'removeByPath')
        .mockImplementation(async () => {});

      jest
        .spyOn(moviesRepository, 'deleteByMovieId')
        .mockImplementation(async () => movie);

      await moviesService.deleteByMovieId(1);

      await expect(fileService.removeByPath).not.toBeCalled();
    });

    it('should delete movie and return success message', async () => {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(async () => movie);

      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => true);

      jest
        .spyOn(fileService, 'removeByPath')
        .mockImplementation(async () => {});

      jest
        .spyOn(moviesRepository, 'deleteByMovieId')
        .mockImplementation(async () => movie);
      await expect(moviesService.deleteByMovieId(1)).resolves.toBe(
        ResponseMessages.SUCCESS,
      );
    });
  });

  describe('find()', function () {
    it('should return empty list,when movies not founds', async () => {
      jest.spyOn(moviesRepository, 'find').mockImplementation(async () => []);
      await expect(moviesService.find(10, 10)).resolves.toHaveLength(0);
    });
    it('should return all movies', async () => {
      const movies: Movie[] = [movie, movie];
      jest
        .spyOn(moviesRepository, 'find')
        .mockImplementation(async () => movies);
      await expect(moviesService.find(10, 10)).resolves.toHaveLength(
        movies.length,
      );
    });
  });
});
