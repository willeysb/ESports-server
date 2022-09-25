import express from 'express';
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes, convertMinutesToHourString } from './utils/convert-hour-and-minutes';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors());
const prisma = new PrismaClient({log: ['query']});

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })
    return response.json(games)
});

app.post('/games/:gameId/ads', async (request, response) => {

    let { gameId } = request.params;
    const body = request.body

    /** 
     * Validar com ZOD JavaScript 
     * https://github.com/colinhacks/zod
    */

    const ad = await prisma.ad.create({
        data: {
            gameId, 
            name: body.name,
            yearsPlaying: Number(body.yearsPlaying),
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHourStringToMinutes(body.hourStart),
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })
    return response.status(201).json({ad})
});

app.post('/games', async (request, response) => {

    const body = request.body

    /** 
     * Validar com ZOD JavaScript 
     * https://github.com/colinhacks/zod
    */

    const game = await prisma.game.create({
        data: {
            title: body.title,
            bannerUrl: body.bannerUrl,
        }
    })
    return response.status(201).json({game})
});

app.get('/games/:gameId/ads', async (request, response) => {

    let { gameId } = request.params;

    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where: {
            gameId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    response.json(ads.map(ad => {
        return ({
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd)
        })
    }))
});

app.get('/ads/:adId/discord', async (request, response) => {

    let { adId } = request.params;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true
        },
        where: {
            id: adId
        }
    })
    response.status(201).json(ad)
});

app.get('/authTwitch', (request, response) => {
    response.status(201).json({token: "r78mn7sfh5ya6ss1z032l7t1cxrsdo", clientId: "ky00qvsu6zbcod8zwqqcbmzt73sq1s"})
})

app.get('/', (req, res) => {
    res.json({message: 'alive'});
});

app.listen(process.env.PORT || 3333);
console.log('app listenning on port', process.env.PORT || 3333)