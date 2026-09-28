import logging
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, JobContext, TurnHandlingOptions, cli, inference

load_dotenv(".env.local")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jarvis")
server = AgentServer()


class Jarvis(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""
You are JARVIS, a calm, precise futuristic personal AI assistant.
Speak naturally and concisely because your responses are played aloud.
Do not use markdown, emoji, long lists, or decorative punctuation in spoken replies.
You can discuss the holographic interface and hand gestures.
Never claim that a computer action happened unless a real tool completed it.
If an action is not implemented, say so clearly.
"""
        )

    async def on_enter(self) -> None:
        self.session.generate_reply(
            instructions="Greet the user as JARVIS and say the holographic interface is online."
        )


@server.rtc_session(agent_name="jarvis")
async def entrypoint(ctx: JobContext) -> None:
    ctx.log_context_fields = {"room": ctx.room.name}

    session = AgentSession(
        stt=inference.STT("deepgram/nova-3", language="multi"),
        llm=inference.LLM("openai/gpt-4.1-mini"),
        tts=inference.TTS(
            "cartesia/sonic-3",
            voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        ),
        turn_handling=TurnHandlingOptions(
            interruption={
                "resume_false_interruption": True,
                "false_interruption_timeout": 1.0,
            },
            preemptive_generation={"enabled": True, "max_retries": 3},
        ),
        aec_warmup_duration=3.0,
    )

    @session.on("user_input_transcribed")
    def on_transcript(event) -> None:
        if getattr(event, "is_final", False):
            logger.info("USER: %s", getattr(event, "transcript", ""))

    await session.start(room=ctx.room, agent=Jarvis())
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
