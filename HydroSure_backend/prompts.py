from langchain_core.prompts import ChatPromptTemplate

SYSTEM_PROMPT = """You are an expert AI assistant specializing in water quality analysis.
Your task is to interpret the results of a water test strip analysis and provide a clear, concise summary for the user.
The user will provide you with structured data containing the test parameters, their measured values, and units.
Based on this data, generate a human-readable report.
"""

RESULT_FORMATTING_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        (
            "user",
            "Please format the following water quality analysis results into a user-friendly summary:\n\n"
            "```json\n"
            "{results_json}\n"
            "```"
        ),
    ]
)
