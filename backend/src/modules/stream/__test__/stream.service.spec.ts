import { NotFoundException } from '@nestjs/common';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { MoviesService } from '../../movies/movies.service';
import { MoviesRepository } from '../../movies/movies.repository';
import { FileService } from '../../file/file.service';
import { StreamService } from '../stream.service';
import { Movie } from '../../../shared/interfaces/movie.interface';

let movie: Movie = {
  id: 'mongoId',
  movieId: 21651561,
  src: '/uploads/movie/my-video.mp4',
  description: 'best movie and ...',
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('StreamService', function () {
  let streamService: StreamService;
  let moviesRepository: MoviesRepository;
  let fileService: FileService;

  beforeEach(() => {
    moviesRepository = new MoviesRepository(jest.fn() as any);
    fileService = new FileService();
    streamService = new StreamService(fileService, moviesRepository);
  });

  it('should defined', () => {
    expect(streamService).toBeDefined();
  });

  describe('stream()', function () {
    it("should throw 'MOVIE_NOT_FOUND',when movie is not found", async function () {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(() => null);

      await expect(
        streamService.movie(1, '', jest.fn() as any),
      ).rejects.toEqual(
        new NotFoundException(ResponseMessages.MOVIE_NOT_FOUND),
      );
    });
    it('should throw SRC_INVALID,when src In Not Found On Storage', async () => {
      jest
        .spyOn(moviesRepository, 'getByMovieId')
        .mockImplementation(async () => movie);

      jest
        .spyOn(fileService, 'checkFileExists')
        .mockImplementation(async () => false);

      await expect(
        streamService.movie(1, '', jest.fn() as any),
      ).rejects.toEqual(new NotFoundException(ResponseMessages.INVALID_SRC));
    });
  });
});
