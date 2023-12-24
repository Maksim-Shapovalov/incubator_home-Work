import request from 'supertest'
import { HTTP_STATUS} from "../src/index";
import {initApp} from "../src/initApp";
import {AvailableResolutionsEnum} from "../src/types/video-type";


describe('/video', ()=>{
    let app:any;

    beforeAll(async ()=>{
        app = initApp()
        await request(app).delete('/AllDataVideoClear')
    })

    it('should return all video ', async () => {
        request(app)
            .get('/videos')
            .expect(HTTP_STATUS.OK_200,[])
    });

    let createVideo:any = null

    it('--POST should create new video with correct data and return correct video ', async () => {
         const createResponse = await request(app)
            .post('/videos')
            .send({
                title: 'chiki',
                author:'piki',
                availableResolutions: ['P144'],
            })
            .expect(HTTP_STATUS.CREATED_201)

        createVideo = createResponse.body;

        expect(createVideo).toEqual({
            id: expect.any(Number),
            title: 'chiki',
            author:'piki',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P144']
        })

        expect(createVideo.publicationDate > createVideo.createdAt)
    });

    it("should'nt update video and return 400 code", async () => {
        await request(app)
            .put('/videos/'+createVideo.id)
            .send({
                title: 1,
                author: '',
                availableResolutions: []
            })
            .expect(HTTP_STATUS.BAD_REQUEST_400)
        await request(app)
            .get('/videos/'+createVideo.id)
            .expect(HTTP_STATUS.OK_200, createVideo)
    });

    it("should'nt update video and return 404 code", async () => {
        await request(app)
            .put('/videos/'+ 2)
            .send({title: 'popit'})
            .expect(HTTP_STATUS.NOT_FOUND_404)
    });

    it("should update video and return 204 code", async () => {
       await request(app)
            .put('/videos/'+ createVideo.id)
            .send({
                title: "qwe",
                author: "ewq",
                availableResolutions: [AvailableResolutionsEnum.P144],
                canBeDownloaded: null,
                minAgeRestriction: 18,
                publicationDate: new Date().toISOString()
            })
            .expect(HTTP_STATUS.NO_CONTENT_204)

        const video = await request(app)
            .get('/videos/'+ createVideo.id)
            .expect(HTTP_STATUS.OK_200)

        expect(video.body).toEqual({
            ...createVideo,
            title: "qwe",
            author: "ewq",
            canBeDownloaded: null,
            minAgeRestriction: 18,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: [AvailableResolutionsEnum.P144],
        })
    });

    it('should delete video and return code 204',  async () => {
        await request(app)
            .delete('/videos/' + createVideo.id)
            .expect(HTTP_STATUS.NO_CONTENT_204)

        await request(app)
            .get('/videos')
            .expect(HTTP_STATUS.OK_200, [])
    });
})