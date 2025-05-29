import { IUser, UserModel } from '@/models/User'
import { ServerLogger } from '@/utils/serverLogger'
import { connectToDatabase } from '@/utils/mongoose'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { APIEndpoints, APIResponse, ErrorResponse } from '@/types/api'
import { PostcardModel } from '@/models/Postcard'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_DURATION = process.env.JWT_DURATION || '7d'

interface LoginRequest {
	email: string
	password: string
}

export async function POST(request: Request): Promise<NextResponse<APIResponse<APIEndpoints.Login> | ErrorResponse>> {
	try {
		const body: LoginRequest = await request.json()
		const { email, password } = body

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 }
			)
		}

		ServerLogger.sensitive(`Login request received for email: ${email}`)

		await connectToDatabase()
		const user: IUser | null = await UserModel.findOne({ email })
		if (!user) {
			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		const token = jwt.sign(
			{ userId: user._id },
			JWT_SECRET,
			{ expiresIn: JWT_DURATION } as SignOptions
		)

		const userResponse = await UserModel.findById(user._id)
			.select('-password')
			.populate({
				path: 'postcards',
				select: '-entries',
				model: PostcardModel,
			})

		return NextResponse.json(
			{
				user: userResponse,
				token
			},
			{ status: 200 }
		)
	} catch (error) {
		ServerLogger.error(`Login error: ${error}`)
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		)
	}
}