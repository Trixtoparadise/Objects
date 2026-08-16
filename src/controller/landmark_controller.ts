import { PrismaPg } from '@prisma/adapter-pg';
import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client.ts';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

export const getLandmarks = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt (req.query.page as string) || 1; 
        const limit = parseInt(req.query.limit as string) || 20;
        
        const skip = (page - 1) * limit;

        const landmarks = await prisma.place.findMany({
            skip: skip,
            take: limit,
            include: {
                photo: {
                    select: {
                        image_id: true,
                        url: true,
                    }
                }
            },
            orderBy: {
                id: 'asc'
            }
        });

        const totalCount = await prisma.place.count();
        
        res.status(200).json({
            success: true,
            meta: {
                total_records: totalCount,
                current_page: page,
                limit: limit,
                total_pages: Math.ceil(totalCount / limit)
            },
            data: landmarks
        });
    } catch (error) {
        console.error("Database Retrieval Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve landmarks combined structural metrics.',
            error: error instanceof Error ? error.message : 'Unknown internal error'
        });
    }
}

export const getLandmarkById = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawId = req.params.id;

        if (!rawId) {
            res.status(400).json({ success: false, message: 'Missing target landmark ID parameters.' });
            return;
        }

        const cleanIdString = Array.isArray(rawId) ? rawId[0] : rawId;

        const landmarkId = BigInt(cleanIdString);

        const landmark = await prisma.place.findUnique({
            where: { id: landmarkId },
            include: {
                photo: {
                    select: {
                        image_id: true,
                        url: true
                    }
                }
            }
        });

        if (!landmark) {
            res.status(404).json({ success: false, message: 'Landmark record not found.' });
            return;
        }

        res.status(200).json({
            success: true,
            data: landmark
        });
    } catch (error) {
        console.error('Single Entry Query Error:', error);
        res.status(500).json({
            success:false, 
            message: 'Failed tot process resource query lookup.',
            error: error instanceof Error ? error.message : 'Unknown conversion mapping error'
        });
    }
}