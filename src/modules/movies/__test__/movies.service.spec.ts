import { MoviesService } from "../movies.service";
import { MoviesRepository } from "../movies.repository";

describe("MoviesService", function() {
  let moviesService: MoviesService;
  let moviesRepository: MoviesRepository;
  beforeEach(() => {
    moviesRepository = new MoviesRepository(jest.fn() as any);
    moviesService = new MoviesService(moviesRepository);
  });

  it("should defined", () => {
    expect(moviesService).toBeDefined()
  })

});
