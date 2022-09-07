import { MoviesService } from "../movies.service";
import { MoviesRepository } from "../movies.repository";
import { Movie } from "../../../shared/interfaces/movie.interface";
import { MovieCreateDto } from "../dto/create.dto";


let movie: Movie = {
  id: "mongoId",
  movieId: 21651561,
  src: "/uploads/movie/my-video.mp4",
  description: "best movie and ...",
  createdAt: new Date(),
  updatedAt: new Date()
};

describe("MoviesService", function() {
  let moviesService: MoviesService;
  let moviesRepository: MoviesRepository;
  beforeEach(() => {
    moviesRepository = new MoviesRepository(jest.fn() as any);
    moviesService = new MoviesService(moviesRepository);
  });

  it("should defined", () => {
    expect(moviesService).toBeDefined();
  });

  describe("create()", function() {
    it("should throw 'MOVIE_IS_DUPLICATE',when src is duplicate", async () => {
      jest.spyOn(moviesRepository, "getBySrc")
        .mockImplementation(async () => movie);
      const input: MovieCreateDto = {
        src: movie.src,
        description: movie.src
      };
      await expect(moviesService.create(input))
        .rejects.toThrow("MOVIE_IS_DUPLICATE");
    });
    it("should throw 'SRC_INVALID', when src file not found", async () => {
    });
  });

});
