import { MoviesService } from "../movies.service";
import { MoviesRepository } from "../movies.repository";
import { Movie } from "../../../shared/interfaces/movie.interface";
import { MovieCreateDto } from "../dto/create.dto";
import { FileService } from "../../file/file.service";
import * as fs from "fs";


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
  let fileService: FileService;

  beforeEach(() => {
    moviesRepository = new MoviesRepository(jest.fn() as any);
    fileService = new FileService();
    moviesService = new MoviesService(moviesRepository, fileService);
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
      jest.spyOn(moviesRepository, "getBySrc")
        .mockImplementation(async () => null);
      jest.spyOn(fileService, "checkFileExists")
        .mockImplementation(async () => false);
      const input: MovieCreateDto = {
        src: movie.src,
        description: movie.src
      };
      await expect(moviesService.create(input))
        .rejects.toThrow("SRC_INVALID");
    });
    it("should create movie and return movie", async () => {
      jest.spyOn(moviesRepository, "getBySrc")
        .mockImplementation(async () => null);
      jest.spyOn(fileService, "checkFileExists")
        .mockImplementation(async () => true);

      jest.spyOn(moviesRepository, "create")
        .mockImplementation(async () => movie);

      await expect(moviesService.create({ src: movie.src, description: movie.description }))
        .resolves.toEqual(movie)

    })
  });

});
